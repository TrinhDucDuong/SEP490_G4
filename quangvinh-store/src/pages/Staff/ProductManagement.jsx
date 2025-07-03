import React, {useState, useEffect} from 'react';
import {Menu, X, Plus, Edit, Eye, Image, ArrowUpDown, Trash2, Calendar, ChevronDown} from 'lucide-react';
import DateRangePicker from '../../components/common/DateRangePicker';
import SidebarForStaff from '../../components/layout/admin/SidebarForStaff.jsx';
import HeaderForManager from '../../components/layout/admin/HeaderForManager.jsx';
import Modal from '../../components/common/Modals.jsx';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Paginations.jsx';
import DataTable from '../../components/common/DataTable';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const colorOptions = [{name: 'Đỏ', hex: '#EF4444'}, {name: 'Xanh lá', hex: '#10B981'}, {
    name: 'Xanh dương',
    hex: '#3B82F6'
}, {name: 'Vàng', hex: '#F59E0B'}, {name: 'Tím', hex: '#8B5CF6'}, {name: 'Cam', hex: '#F97316'}, {
    name: 'Hồng',
    hex: '#EC4899'
}, {name: 'Xám', hex: '#6B7280'}, {name: 'Đen', hex: '#000000'}, {name: 'Trắng', hex: '#FFFFFF'}];

const sizeOptions = ['36', '37', '38', '39', '40', '41', '42', '43', '44', 'XS', 'S', 'M', 'L', 'XL'];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        brand: '',
        color: '',
        size: '',
        status: '',
        category: '',      // THÊM MỚI
        productType: '',   // THÊM MỚI
        startDate: '',
        endDate: '',
        datePreset: ''
    });
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});

    // Modals states
    const [showImageModal, setShowImageModal] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showColorFilter, setShowColorFilter] = useState(false);

    // Click outside handler for color filter
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showColorFilter && !event.target.closest('.relative')) {
                setShowColorFilter(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorFilter]);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        code: '',
        price: '',
        brand: '',
        description: '',
        productTypeId: '',
        coverImage: null,
        productImages: [null, null, null, null, null, null],
        variants: []
    });
    const [updateProduct, setUpdateProduct] = useState(null);

    // Sample data
    const [brands, setBrands] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [categories, setCategories] = useState([]);  // THÊM MỚI

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // THÊM VÀO TRƯỚC return() - Helper functions cho price formatting
    const formatPriceInput = (value) => {
        if (!value) return '';
        // Chuyển số thành string với format dấu chấm
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const parsePriceInput = (value) => {
        if (!value) return '';
        // Loại bỏ tất cả dấu chấm và chuyển về số
        return value.replace(/\./g, '');
    };

    const handlePriceChange = (e, isUpdate = false) => {
        const inputValue = e.target.value;

        // Chỉ cho phép số và dấu chấm
        const numericValue = inputValue.replace(/[^0-9.]/g, '');

        // Parse về số nguyên (loại bỏ dấu chấm)
        const parsedValue = parsePriceInput(numericValue);

        if (isUpdate) {
            setUpdateProduct({...updateProduct, price: parsedValue});
        } else {
            setNewProduct({...newProduct, price: parsedValue});
        }
    };

    // Sample data initialization
    useEffect(() => {
        // Sample brands
        setBrands([{id: 'BR001', name: 'Nike'}, {id: 'BR002', name: 'Adidas'}, {
            id: 'BR003',
            name: 'Puma'
        }, {id: 'BR004', name: 'Under Armour'}, {id: 'BR005', name: 'Reebok'}]);

        // THÊM Sample categories
        setCategories([
            {id: 'DM001', name: 'Đồ thể thao', status: 'Đang bán'},
            {id: 'DM002', name: 'Đồ mùa hè', status: 'Đang bán'},
            {id: 'DM003', name: 'Đồ dạo phố', status: 'Đang bán'},
            {id: 'DM004', name: 'Đồ công sở', status: 'Đã ngừng bán'},
            {id: 'DM005', name: 'Đồ mùa đông', status: 'Đang bán'}
        ]);

        // Sample product types (with category info)
        setProductTypes([{
            id: 'LTP001',
            name: 'Áo thun',
            categoryId: 'DM001',
            categoryName: 'Đồ thể thao'
        }, {id: 'LTP002', name: 'Quần short', categoryId: 'DM002', categoryName: 'Đồ mùa hè'}, {
            id: 'LTP003',
            name: 'Áo khoác',
            categoryId: 'DM003',
            categoryName: 'Đồ dạo phố'
        }, {id: 'LTP004', name: 'Áo sơ mi', categoryId: 'DM004', categoryName: 'Đồ công sở'}, {
            id: 'LTP005',
            name: 'Áo len',
            categoryId: 'DM005',
            categoryName: 'Đồ mùa đông'
        }]);

        // Sample products
        setProducts([{
            id: '1',
            name: 'Áo thun nam Nike Air',
            code: 'SP001',
            price: 650000,
            coverImage: 'https://picsum.photos/200/200?random=1',
            productImages: ['https://picsum.photos/200/200?random=1', 'https://picsum.photos/200/200?random=2', 'https://picsum.photos/200/200?random=3', 'https://picsum.photos/200/200?random=4', 'https://picsum.photos/200/200?random=5'],
            brand: 'Nike',
            color: 'Đỏ',
            size: 'M',
            quantity: 50,
            description: '<p>Áo thun nam chất liệu cotton thoáng mát, thiết kế hiện đại, phù hợp cho hoạt động thể thao và đời sống hàng ngày.</p>',
            productTypeId: 'LTP001',
            variants: [{id: 'V001', code: 'BT001', color: 'Đỏ', size: 'M', quantity: 20}, {
                id: 'V002',
                code: 'BT002',
                color: 'Xanh dương',
                size: 'L',
                quantity: 30
            }],
            importedQuantity: 100,
            soldQuantity: 50,
            createdDate: '2025-01-10',
            createdBy: 'Admin',
            updatedBy: [{user: 'Staff1', date: '2025-02-15T10:30:00'}, {user: 'Admin', date: '2025-03-01T14:20:00'}],
            status: 'Đang bán'
        }, {
            id: '2',
            name: 'Quần short Adidas',
            code: 'SP002',
            price: 450000,
            coverImage: 'https://picsum.photos/200/200?random=6',
            productImages: ['https://picsum.photos/200/200?random=6', 'https://picsum.photos/200/200?random=7', 'https://picsum.photos/200/200?random=8'],
            brand: 'Adidas',
            color: 'Xanh dương',
            size: 'L',
            quantity: 30,
            description: '<p>Quần short nam thể thao, chất liệu thoáng mát, phù hợp cho mùa hè và các hoạt động thể thao.</p>',
            productTypeId: 'LTP002',
            variants: [{id: 'V003', code: 'BT003', color: 'Xanh dương', size: 'L', quantity: 30}],
            importedQuantity: 80,
            soldQuantity: 50,
            createdDate: '2025-02-20',
            createdBy: 'Staff1',
            updatedBy: [{user: 'Staff1', date: '2025-02-20T09:15:00'}],
            status: 'Đang bán'
        }, {
            id: '3',
            name: 'Áo khoác Puma',
            code: 'SP003',
            price: 850000,
            coverImage: 'https://picsum.photos/200/200?random=9',
            productImages: ['https://picsum.photos/200/200?random=9', 'https://picsum.photos/200/200?random=10'],
            brand: 'Puma',
            color: 'Đen',
            size: 'XL',
            quantity: 15,
            description: '<p>Áo khoác nam chống nước, ấm áp, thiết kế thời trang, phù hợp cho mùa đông.</p>',
            productTypeId: 'LTP003',
            variants: [{id: 'V004', code: 'BT004', color: 'Đen', size: 'XL', quantity: 15}],
            importedQuantity: 60,
            soldQuantity: 45,
            createdDate: '2025-03-05',
            createdBy: 'Admin',
            updatedBy: [],
            status: 'Đã ngừng bán'
        }]);
    }, []);

    // Search, filter, sort
    useEffect(() => {
        let result = [...products];

        // Search
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Filter
        if (filters.brand) {
            result = result.filter(p => p.brand === filters.brand);
        }
        if (filters.color) {
            result = result.filter(p => p.color === filters.color);
        }
        if (filters.size) {
            result = result.filter(p => p.size === filters.size);
        }
        if (filters.status) {
            result = result.filter(p => p.status === filters.status);
        }

        // THÊM MỚI - Filter theo category
        if (filters.category) {
            result = result.filter(p => {
                const productType = productTypes.find(pt => pt.id === p.productTypeId);
                return productType && productType.categoryId === filters.category;
            });
        }

        // THÊM MỚI - Filter theo productType
        if (filters.productType) {
            result = result.filter(p => p.productTypeId === filters.productType);
        }

        if (filters.startDate && filters.endDate) {
            result = result.filter(p => {
                const productDate = new Date(p.createdDate);
                const startDate = new Date(filters.startDate);
                const endDate = new Date(filters.endDate);

                // Set hours to 0 for accurate date comparison
                productDate.setHours(0, 0, 0, 0);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);

                return productDate >= startDate && productDate <= endDate;
            });
        }

        // Sort
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'name' || sortConfig.key === 'code') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                    return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                } else if (sortConfig.key === 'quantity' || sortConfig.key === 'soldQuantity' || sortConfig.key === 'price') {
                    // THÊM 'price' vào điều kiện số
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }
                return 0;
            });
        }
        setFilteredProducts(result);
        setCurrentPage(1);
    }, [products, searchTerm, filters, sortConfig, productTypes]); // THÊM productTypes vào dependency

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({...prev, [key]: value}));
    };

    const clearFilters = () => {
        setFilters({
            brand: '',
            color: '',
            size: '',
            status: '',
            category: '',      // THÊM MỚI
            productType: '',   // THÊM MỚI
            startDate: '',
            endDate: '',
            datePreset: ''
        });
        setSearchTerm('');
        setSortConfig({key: null, direction: 'asc'});
    };

    // Modals handlers
    const openImageModal = (product) => {
        setSelectedProduct(product);
        setShowImageModal(true);
    };

    const openDescriptionModal = (product) => {
        setSelectedProduct(product);
        setShowDescriptionModal(true);
    };

    const openDetailModal = (product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const openAddModal = () => {
        setNewProduct({
            name: '',
            code: '',
            price: '',
            brand: '',
            description: '',
            productTypeId: '',
            coverImage: null,
            productImages: [null, null, null, null, null, null],
            variants: []
        });
        setShowAddModal(true);
    };

    const openUpdateModal = (product) => {
        setUpdateProduct({
            ...product, productImages: [...product.productImages, ...Array(6 - product.productImages.length).fill(null)]
        });
        setShowUpdateModal(true);
    };

    const openStatusModal = (product) => {
        setSelectedProduct(product);
        setShowStatusModal(true);
    };

    // File upload handlers
    const handleFileUpload = (file, isUpdate = false, index = null, isCover = false) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;

            if (isUpdate) {
                if (isCover) {
                    setUpdateProduct(prev => ({...prev, coverImage: imageUrl}));
                } else {
                    const newImages = [...updateProduct.productImages];
                    newImages[index] = imageUrl;
                    setUpdateProduct(prev => ({...prev, productImages: newImages}));
                }
            } else {
                if (isCover) {
                    setNewProduct(prev => ({...prev, coverImage: imageUrl}));
                } else {
                    const newImages = [...newProduct.productImages];
                    newImages[index] = imageUrl;
                    setNewProduct(prev => ({...prev, productImages: newImages}));
                }
            }
        };
        reader.readAsDataURL(file);
    };

    // Generate auto variant code
    const generateVariantCode = (productCode, variantIndex) => {
        return `BT${String(Date.now()).slice(-3)}${String(variantIndex + 1).padStart(2, '0')}`;
    };

    // CRUD operations
    const handleAddProduct = () => {
        if (!newProduct.name.trim() || !newProduct.code.trim()) return;

        const newId = (products.length + 1).toString();
        const totalQuantity = newProduct.variants.reduce((sum, variant) => sum + (Number(variant.quantity) || 0), 0);

        const productToAdd = {
            ...newProduct,
            id: newId,
            quantity: totalQuantity,
            importedQuantity: totalQuantity,
            soldQuantity: 0,
            status: 'Đang bán',
            createdDate: new Date().toISOString().split('T')[0],
            createdBy: 'Admin',
            updatedBy: [],
            // Get color and size from first variant
            color: newProduct.variants[0]?.color || '',
            size: newProduct.variants[0]?.size || '',
            // Filter out empty images
            productImages: newProduct.productImages.filter(img => img !== null),
            // Đảm bảo price là số
            price: Number(newProduct.price) || 0
        };

        setProducts([...products, productToAdd]);
        setShowAddModal(false);
    };

    const handleUpdateProduct = () => {
        if (!updateProduct.name.trim() || !updateProduct.code.trim()) return;

        // TÍNH LẠI TỔNG SỐ LƯỢNG từ variants
        const totalQuantity = updateProduct.variants && updateProduct.variants.length > 0
            ? updateProduct.variants.reduce((sum, variant) => sum + (Number(variant.quantity) || 0), 0)
            : 0;

        const updatedList = products.map(p => {
            if (p.id === updateProduct.id) {
                const updatedBy = p.updatedBy ? [...p.updatedBy] : [];
                updatedBy.push({user: 'Admin', date: new Date().toISOString()});

                return {
                    ...updateProduct,
                    quantity: totalQuantity, // CẬP NHẬT tổng số lượng
                    updatedBy,
                    productImages: updateProduct.productImages.filter(img => img !== null),
                    // Cập nhật color và size từ variant đầu tiên
                    color: updateProduct.variants[0]?.color || updateProduct.color,
                    size: updateProduct.variants[0]?.size || updateProduct.size,
                };
            }
            return p;
        });

        setProducts(updatedList);
        setShowUpdateModal(false);
    };

    const handleStatusChange = () => {
        if (!selectedProduct) return;

        const newStatus = selectedProduct.status === 'Đang bán' ? 'Đã ngừng bán' : 'Đang bán';
        const updatedList = products.map(p => {
            if (p.id === selectedProduct.id) {
                const updatedBy = p.updatedBy ? [...p.updatedBy] : [];
                updatedBy.push({user: 'Admin', date: new Date().toISOString()});
                return {...p, status: newStatus, updatedBy};
            }
            return p;
        });
        setProducts(updatedList);
        setShowStatusModal(false);
    };

    const getStatusColor = (status) => {
        return status === 'Đang bán' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200';
    };

    // Add/Remove variants
    const addVariant = (isUpdate = false) => {
        const product = isUpdate ? updateProduct : newProduct;
        const setProduct = isUpdate ? setUpdateProduct : setNewProduct;

        const newVariantCode = generateVariantCode(product.code, product.variants.length);

        const newVariants = [...(product.variants || []), {
            code: newVariantCode,
            color: '',
            size: '',
            quantity: 0
        }];

        // TÍNH LẠI TỔNG SỐ LƯỢNG
        const totalQuantity = newVariants.reduce((sum, variant) => sum + (Number(variant.quantity) || 0), 0);

        setProduct({
            ...product,
            variants: newVariants,
            quantity: totalQuantity // CẬP NHẬT tổng số lượng
        });
    };

    const removeVariant = (index, isUpdate = false) => {
        const product = isUpdate ? updateProduct : newProduct;
        const setProduct = isUpdate ? setUpdateProduct : setNewProduct;

        const newVariants = product.variants.filter((_, i) => i !== index);

        // TÍNH LẠI TỔNG SỐ LƯỢNG
        const totalQuantity = newVariants.reduce((sum, variant) => sum + (Number(variant.quantity) || 0), 0);

        setProduct({
            ...product,
            variants: newVariants,
            quantity: totalQuantity // CẬP NHẬT tổng số lượng
        });
    };

    const updateVariant = (index, field, value, isUpdate = false) => {
        const product = isUpdate ? updateProduct : newProduct;
        const setProduct = isUpdate ? setUpdateProduct : setNewProduct;

        const newVariants = [...product.variants];
        newVariants[index][field] = field === 'quantity' ? Number(value) || 0 : value;

        // TÍNH LẠI TỔNG SỐ LƯỢNG khi thay đổi quantity
        const totalQuantity = newVariants.reduce((sum, variant) => sum + (Number(variant.quantity) || 0), 0);

        setProduct({
            ...product,
            variants: newVariants,
            quantity: totalQuantity // CẬP NHẬT tổng số lượng
        });
    };

    // Columns for DataTable
    const columns = [{
        key: 'stt',
        header: 'STT',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        render: (product, index) => (<span className="font-mono text-sm font-semibold text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                </span>),
        mobileRender: (product, index) => (<div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{(currentPage - 1) * itemsPerPage + index + 1}
                    </span>
            <button
                onClick={() => openStatusModal(product)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getStatusColor(product.status)}`}
            >
                {product.status}
            </button>
        </div>)
    }, {
        key: 'name',
        header: 'Tên sản phẩm',
        render: (product) => <div className="font-medium text-gray-900">{product.name}</div>,
        mobileRender: (product) => (
            <div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.code}</p>
                {/* FIX: Sử dụng formatPriceInput cho mobile */}
                <p className="text-sm font-semibold text-green-600">
                    {product.price ? formatPriceInput(product.price) : '0'} VNĐ
                </p>
            </div>
        )
    }, {
        key: 'code',
        header: 'Mã sản phẩm',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => (<span className="font-mono text-sm text-gray-700">{product.code}</span>)
    }, {
        key: 'productImages',
        header: 'Hình ảnh sản phẩm',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => (<div className="flex justify-center">
            <img
                src={product.coverImage}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openImageModal(product)}
            />
        </div>)
    }, {
        key: 'brand',
        header: 'Brand',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => <div className="text-center text-gray-700">{product.brand}</div>
    }, {
        key: 'color',
        header: 'Màu sắc',
        hideOnMobile: true,
        render: (product) => (<div className="flex items-center space-x-2">
            <div
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{backgroundColor: colorOptions.find(c => c.name === product.color)?.hex || '#000'}}
                title={product.color}
            />
            <span className="text-sm">{product.color}</span>
        </div>)
    }, {
        key: 'size',
        header: 'Size',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => <div className="text-center text-gray-700">{product.size}</div>
    }, {
        key: 'quantity',
        header: 'Số lượng',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => (<span className="font-semibold text-gray-900">{product.quantity}</span>)
    }, {
        key: 'description',
        header: 'Mô tả sản phẩm',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => (<button
            onClick={() => openDescriptionModal(product)}
            className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600"
        >
            Mô tả chi tiết
        </button>)
    }, {
        key: 'detail',
        header: 'Thông tin chi tiết sản phẩm',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => (<button
            onClick={() => openDetailModal(product)}
            className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600"
        >
            <Eye className="h-3 w-3 mr-1"/>
            Thông tin chi tiết
        </button>)
    }, {
        key: 'price',
        header: 'Giá sản phẩm',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        hideOnMobile: true,
        render: (product) => (
            <div className="text-center">
            <span className="font-semibold text-green-600">
                {/* FIX: Sử dụng formatPriceInput để hiển thị với dấu chấm */}
                {product.price ? formatPriceInput(product.price) : '0'} VNĐ
            </span>
            </div>
        )
    }, {
        key: 'actions',
        header: 'Hành động',
        headerAlign: 'text-center',
        cellAlign: 'text-center',
        render: (product) => (<div className="flex flex-col items-center space-y-2 min-w-[100px]">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openUpdateModal(product);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Cập nhật"
            >
                <Edit className="h-4 w-4"/>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openStatusModal(product);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 w-20 ${getStatusColor(product.status)}`}
                title="Trạng thái"
            >
                {product.status}
            </button>
        </div>),
        mobileRender: (product) => (<div className="flex space-x-2 mt-3">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openImageModal(product);
                }}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Hình ảnh"
            >
                <Image className="h-4 w-4"/>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openDetailModal(product);
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Chi tiết"
            >
                <Eye className="h-4 w-4"/>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openUpdateModal(product);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Cập nhật"
            >
                <Edit className="h-4 w-4"/>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    openStatusModal(product);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${getStatusColor(product.status)}`}
                title="Trạng thái"
            >
                {product.status}
            </button>
        </div>)
    },];

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50">
            {/* Header - Fixed at top với z-index cao */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <HeaderForManager username="Ngô Quang Thắng" role="Admin"/>
            </div>

            {/* Sidebar - Fixed below header */}
            <div className="fixed left-0 top-16 z-40">
                <SidebarForStaff/>
            </div>

            {/* Mobile Menu Button - Chỉ hiện trên mobile */}
            <div className="lg:hidden fixed top-20 left-4 z-30">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white shadow-md"
                >
                    <Menu className="h-6 w-6"/>
                </button>
            </div>

            {/* Mobile Sidebar Overlay - Chỉ cho mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-60 lg:hidden">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative w-64 h-full">
                        <SidebarForStaff/>
                    </div>
                </div>
            )}

            {/* Main Content - Với margin để tránh sidebar che */}
            <div className="ml-0 lg:ml-64 pt-16">
                <div className="p-4 sm:p-6">
                    {/* Page Title */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
                            <p className="text-sm text-gray-600 mt-1">Quản lý các sản phẩm và biến thể</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Thêm sản phẩm
                        </button>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm tên hoặc mã sản phẩm..."
                                />
                            </div>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
                            >
                                Xóa tất cả lọc
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="space-y-6">
                            {/* Filter Grid - Cập nhật với 7 ô filter */}
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                                {/* Brand Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Lọc theo thương hiệu
                                    </label>
                                    <select
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.brand}
                                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                                    >
                                        <option value="">Tất cả thương hiệu</option>
                                        {brands.map((b) => (
                                            <option key={b.id} value={b.name}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* THÊM MỚI - Category Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Lọc theo danh mục
                                    </label>
                                    <select
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {categories.filter(cat => cat.status === 'Đang bán').map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* THÊM MỚI - ProductType Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Lọc theo loại trang phục
                                    </label>
                                    <select
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.productType}
                                        onChange={(e) => handleFilterChange('productType', e.target.value)}
                                    >
                                        <option value="">Loại trang phục</option>
                                        {productTypes.map((pt) => (
                                            <option key={pt.id} value={pt.id}>{pt.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Color Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Lọc theo màu sắc
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowColorFilter(!showColorFilter)}
                                            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                                        >
                                        <span className="truncate">
                                            {filters.color || 'Chọn màu'}
                                        </span>
                                            <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none"
                                                 stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 9l-7 7-7-7"/>
                                            </svg>
                                        </button>

                                        {showColorFilter && (
                                            <div
                                                className="absolute top-full left-0 mt-1 w-full min-w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4">
                                                <div className="grid grid-cols-5 gap-3">
                                                    {colorOptions.map((color) => (
                                                        <div key={color.name} className="flex flex-col items-center">
                                                            <button
                                                                onClick={() => {
                                                                    handleFilterChange('color', filters.color === color.name ? '' : color.name);
                                                                    setShowColorFilter(false);
                                                                }}
                                                                className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-all duration-200 ${
                                                                    filters.color === color.name
                                                                        ? 'border-gray-800 ring-2 ring-blue-500 ring-offset-1'
                                                                        : 'border-gray-300 hover:border-gray-400'
                                                                }`}
                                                                style={{backgroundColor: color.hex}}
                                                                title={color.name}
                                                            />
                                                            <span
                                                                className="text-xs text-gray-600 mt-1 text-center">{color.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        handleFilterChange('color', '');
                                                        setShowColorFilter(false);
                                                    }}
                                                    className="w-full mt-3 px-3 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                                                >
                                                    Xóa tất cả
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Size Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Lọc theo kích thước
                                    </label>
                                    <select
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.size}
                                        onChange={(e) => handleFilterChange('size', e.target.value)}
                                    >
                                        <option value="">Tất cả kích thước</option>
                                        {sizeOptions.map((size) => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Lọc theo trạng thái
                                    </label>
                                    <select
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                    >
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="Đang bán">Đang bán</option>
                                        <option value="Đã ngừng bán">Đã ngừng bán</option>
                                    </select>
                                </div>

                                {/* DateRangePicker */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Lọc theo ngày tạo
                                    </label>
                                    <DateRangePicker
                                        value={{
                                            startDate: filters.startDate || '',
                                            endDate: filters.endDate || '',
                                            preset: filters.datePreset || ''
                                        }}
                                        onChange={(dateRange) => {
                                            handleFilterChange('startDate', dateRange.startDate);
                                            handleFilterChange('endDate', dateRange.endDate);
                                            handleFilterChange('datePreset', dateRange.preset);
                                        }}
                                        placeholder="Chọn ngày"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Sort Buttons - Thêm sort cho price */}
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleSort('name')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        sortConfig.key === 'name'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown
                                        className={`h-4 w-4 ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>
                                        Sắp xếp theo tên: {sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'Z → A' : 'A → Z'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleSort('code')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        sortConfig.key === 'code'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown
                                        className={`h-4 w-4 ${sortConfig.key === 'code' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>
                                        Sắp xếp theo mã: {sortConfig.key === 'code' && sortConfig.direction === 'desc' ? 'Z → A' : 'A → Z'}
                                    </span>
                                </button>

                                {/* THÊM MỚI - Sort theo giá */}
                                <button
                                    onClick={() => handleSort('price')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        sortConfig.key === 'price'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown
                                        className={`h-4 w-4 ${sortConfig.key === 'price' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>
                                        Sắp xếp theo giá: {sortConfig.key === 'price' && sortConfig.direction === 'desc' ? 'Cao → Thấp' : 'Thấp → Cao'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleSort('quantity')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        sortConfig.key === 'quantity'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown
                                        className={`h-4 w-4 ${sortConfig.key === 'quantity' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>
                                        Sắp xếp SL còn: {sortConfig.key === 'quantity' && sortConfig.direction === 'desc' ? 'Nhiều → Ít' : 'Ít → Nhiều'}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleSort('soldQuantity')}
                                    className={`flex items-center space-x-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                        sortConfig.key === 'soldQuantity'
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <ArrowUpDown
                                        className={`h-4 w-4 ${sortConfig.key === 'soldQuantity' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}/>
                                    <span>
                                        Sắp xếp SL bán: {sortConfig.key === 'soldQuantity' && sortConfig.direction === 'desc' ? 'Nhiều → Ít' : 'Ít → Nhiều'}
                                    </span>
                                </button>
                            </div>

                            {/* Results info */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <p className="text-sm text-gray-600">
                                        Tìm thấy <span
                                        className="font-semibold text-gray-900">{filteredProducts.length}</span> sản
                                        phẩm
                                        {searchTerm && (<span> cho từ khóa "<span
                                            className="font-semibold text-blue-600">{searchTerm}</span>"</span>)}
                                    </p>

                                    {(filters.brand || filters.category || filters.productType || filters.color || filters.size || filters.status || filters.startDate || filters.endDate || searchTerm) && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs text-gray-500">Bộ lọc đang áp dụng:</span>
                                            {filters.brand && (<span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {filters.brand}
                                                </span>)}
                                            {filters.category && (<span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {categories.find(c => c.id === filters.category)?.name}
                                                </span>)}
                                            {filters.productType && (<span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                                    {productTypes.find(pt => pt.id === filters.productType)?.name}
                                                </span>)}
                                            {filters.color && (<span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {filters.color}
                                                </span>)}
                                            {filters.size && (<span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {filters.size}
                                                </span>)}
                                            {filters.status && (<span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {filters.status}
                                                </span>)}
                                            {filters.startDate && filters.endDate && (<span
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                                    {new Date(filters.startDate).toLocaleDateString('vi-VN')} - {new Date(filters.endDate).toLocaleDateString('vi-VN')}
                                                </span>)}
                                        </div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <DataTable
                        columns={columns}
                        data={currentItems}
                        emptyMessage="Không có sản phẩm nào"
                    />

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredProducts.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemName="sản phẩm"
                        />
                    </div>
                </div>
            </div>

            {/* Image Modals */}
            <Modal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                title={`Hình ảnh sản phẩm - ${selectedProduct?.name}`}
                size="xl"
            >
                {selectedProduct && (<div className="space-y-4">
                    <p className="text-gray-600">Danh sách hình ảnh sản phẩm:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[selectedProduct.coverImage, ...selectedProduct.productImages].slice(0, 7).map((img, idx) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={img}
                                    alt={`Ảnh ${idx + 1}`}
                                    className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => window.open(img, '_blank')}
                                />
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                        <span
                                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                            Click để xem lớn
                                        </span>
                                </div>
                                <div
                                    className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                    {idx === 0 ? 'Ảnh bìa' : `Ảnh ${idx}`}
                                </div>
                            </div>))}
                    </div>
                </div>)}
            </Modal>

            {/* Description Modals */}
            <Modal
                isOpen={showDescriptionModal}
                onClose={() => setShowDescriptionModal(false)}
                title={`Mô tả sản phẩm - ${selectedProduct?.name}`}
                size="md"
            >
                {selectedProduct && (<div className="prose max-w-none"
                                          dangerouslySetInnerHTML={{__html: selectedProduct.description || 'Không có mô tả'}}/>)}
            </Modal>

            {/* Detail Modals */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title={`Thông tin chi tiết sản phẩm - ${selectedProduct?.name}`}
                size="xl"
            >
                {selectedProduct && (<div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục sản
                                phẩm:</label>
                            <p className="text-gray-900">{productTypes.find(pt => pt.id === selectedProduct.productTypeId)?.categoryName || 'Không có'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại trang
                                phục:</label>
                            <p className="text-gray-900">{productTypes.find(pt => pt.id === selectedProduct.productTypeId)?.name || 'Không có'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số hàng nhập:</label>
                            <p className="text-gray-900">{selectedProduct.importedQuantity || 0}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng bán:</label>
                            <p className="text-gray-900">{selectedProduct.soldQuantity || 0}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng còn
                                lại:</label>
                            <p className="text-gray-900">{selectedProduct.quantity}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian tạo:</label>
                            <p className="text-gray-900">{new Date(selectedProduct.createdDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Người tạo:</label>
                            <p className="text-gray-900">{selectedProduct.createdBy}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Người tạo:</label>
                            <p className="text-gray-900">{selectedProduct.createdBy}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Người chỉnh sửa:</label>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                {selectedProduct.updatedBy && selectedProduct.updatedBy.length > 0 ? (
                                    <ul className="space-y-1">
                                        {selectedProduct.updatedBy.map((u, idx) => (
                                            <li key={idx} className="text-sm text-gray-700 flex items-center justify-between">
                                                <span className="font-medium">{u.user}</span>
                                                <span className="text-gray-500">{new Date(u.date).toLocaleString('vi-VN')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Chưa có người chỉnh sửa</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Biến thể sản phẩm:</label>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-gray-300 rounded-lg">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left border-b">Mã biến thể</th>
                                    <th className="px-4 py-2 text-center border-b">Màu sắc</th>
                                    <th className="px-4 py-2 text-center border-b">Size</th>
                                    <th className="px-4 py-2 text-right border-b">Số lượng</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                                    selectedProduct.variants.map((variant, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="px-4 py-2 font-mono text-sm">{variant.code}</td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{backgroundColor: colorOptions.find(c => c.name === variant.color)?.hex || '#000'}}
                                                    />
                                                    <span className="text-sm">{variant.color}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-center">{variant.size}</td>
                                            <td className="px-4 py-2 text-right font-semibold">{variant.quantity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                            Không có biến thể nào
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>)}
            </Modal>

            {/* Status Change Modals */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Thay đổi trạng thái"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        {selectedProduct?.status === 'Đang bán'
                            ? `Bạn muốn ngừng bán sản phẩm "${selectedProduct?.name}" không?`
                            : `Bạn muốn bán lại sản phẩm "${selectedProduct?.name}" không?`
                        }
                    </p>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowStatusModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Không
                        </button>
                        <button
                            onClick={handleStatusChange}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Có
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add Product Modals */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Chi tiết sản phẩm"
                size="xl"
            >
                <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Tên Sản Phẩm và Mã Sản Phẩm */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                placeholder="Điền tên sản phẩm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mã sản phẩm</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={newProduct.code}
                                onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                                placeholder="Điền mã sản phẩm"
                            />
                        </div>
                    </div>

                    {/* Giá Tiền và Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá Tiền - VNĐ</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={newProduct.price ? formatPriceInput(newProduct.price) : ''}
                                onChange={(e) => handlePriceChange(e, false)}
                                placeholder="Ví dụ: 10.000.000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={newProduct.brand}
                                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                            >
                                <option value="">None</option>
                                {brands.map(b => (
                                    <option key={b.id} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Danh Mục */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Danh Mục</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-h-40 overflow-y-auto"
                            value={newProduct.productTypeId}
                            onChange={(e) => setNewProduct({...newProduct, productTypeId: e.target.value})}
                        >
                            <option value="">None</option>
                            {productTypes.map(pt => (
                                <option key={pt.id} value={pt.id}>
                                    {pt.name} ({pt.categoryName})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mô Tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={newProduct.description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setNewProduct({...newProduct, description: data});
                            }}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                            }}
                        />
                    </div>

                    {/* Ảnh Sản Phẩm */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Sản Phẩm</label>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            {/* Ảnh Bìa */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Ảnh Bìa</label>
                                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 relative">
                                    {newProduct.coverImage ? (
                                        <img src={newProduct.coverImage} alt="Cover" className="w-full h-full object-cover rounded-lg"/>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Thêm ảnh bìa</span>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={(e) => handleFileUpload(e.target.files[0], false, null, true)}
                                    />
                                </div>
                            </div>

                            {/* Ảnh Sản Phẩm Khác */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Ảnh Sản Phẩm Khác (Tối đa 6 ảnh)</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {newProduct.productImages.map((img, idx) => (
                                        <div key={idx} className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative">
                                            {img ? (
                                                <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover rounded-lg"/>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Ảnh {idx + 1}</span>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => handleFileUpload(e.target.files[0], false, idx, false)}
                                            />
                                            {img && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newImages = [...newProduct.productImages];
                                                        newImages[idx] = null;
                                                        setNewProduct({...newProduct, productImages: newImages});
                                                    }}
                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Biến Thể Sản Phẩm */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700">Biến Thể Sản Phẩm</label>
                            <button
                                type="button"
                                onClick={() => addVariant(false)}
                                className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                            >
                                <Plus className="h-4 w-4 mr-1"/>
                                Thêm biến thể
                            </button>
                        </div>

                        <div className="space-y-4">
                            {newProduct.variants.map((variant, idx) => (
                                <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium text-gray-700">Biến thể {idx + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(idx, false)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Mã biến thể</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={variant.code}
                                                onChange={(e) => updateVariant(idx, 'code', e.target.value, false)}
                                                placeholder="Mã tự động"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Màu sắc</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={variant.color}
                                                onChange={(e) => updateVariant(idx, 'color', e.target.value, false)}
                                            >
                                                <option value="">Chọn màu</option>
                                                {colorOptions.map(color => (
                                                    <option key={color.name} value={color.name}>{color.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={variant.size}
                                                onChange={(e) => updateVariant(idx, 'size', e.target.value, false)}
                                            >
                                                <option value="">Chọn size</option>
                                                {sizeOptions.map(size => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={variant.quantity}
                                                onChange={(e) => updateVariant(idx, 'quantity', e.target.value, false)}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {newProduct.variants.length === 0 && (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-sm">Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleAddProduct}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Thêm sản phẩm
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Update Product Modals */}
            <Modal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                title="Cập nhật sản phẩm"
                size="xl"
            >
                {updateProduct && (
                    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                        {/* Tên Sản Phẩm và Mã Sản Phẩm */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={updateProduct.name}
                                    onChange={(e) => setUpdateProduct({...updateProduct, name: e.target.value})}
                                    placeholder="Điền tên sản phẩm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mã sản phẩm</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={updateProduct.code}
                                    onChange={(e) => setUpdateProduct({...updateProduct, code: e.target.value})}
                                    placeholder="Điền mã sản phẩm"
                                />
                            </div>
                        </div>

                        {/* Giá Tiền và Brand */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Giá Tiền - VNĐ</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={updateProduct.price ? formatPriceInput(updateProduct.price) : ''}
                                    onChange={(e) => handlePriceChange(e, true)}
                                    placeholder="Ví dụ: 10.000.000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={updateProduct.brand}
                                    onChange={(e) => setUpdateProduct({...updateProduct, brand: e.target.value})}
                                >
                                    <option value="">None</option>
                                    {brands.map(b => (
                                        <option key={b.id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Danh Mục */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh Mục</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={updateProduct.productTypeId}
                                onChange={(e) => setUpdateProduct({...updateProduct, productTypeId: e.target.value})}
                            >
                                <option value="">None</option>
                                {productTypes.map(pt => (
                                    <option key={pt.id} value={pt.id}>
                                        {pt.name} ({pt.categoryName})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mô Tả */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={updateProduct.description}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setUpdateProduct({...updateProduct, description: data});
                                }}
                                config={{
                                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                                }}
                            />
                        </div>

                        {/* Ảnh Sản Phẩm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Sản Phẩm</label>
                            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                {/* Ảnh Bìa */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Ảnh Bìa</label>
                                    <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 relative">
                                        {updateProduct.coverImage ? (
                                            <img src={updateProduct.coverImage} alt="Cover" className="w-full h-full object-cover rounded-lg"/>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Thêm ảnh bìa</span>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={(e) => handleFileUpload(e.target.files[0], true, null, true)}
                                        />
                                    </div>
                                </div>

                                {/* Ảnh Sản Phẩm Khác */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Ảnh Sản Phẩm Khác (Tối đa 6 ảnh)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {updateProduct.productImages.map((img, idx) => (
                                            <div key={idx} className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative">
                                                {img ? (
                                                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover rounded-lg"/>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Ảnh {idx + 1}</span>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleFileUpload(e.target.files[0], true, idx, false)}
                                                />
                                                {img && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = [...updateProduct.productImages];
                                                            newImages[idx] = null;
                                                            setUpdateProduct({...updateProduct, productImages: newImages});
                                                        }}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Biến Thể Sản Phẩm */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Biến Thể Sản Phẩm</label>
                                <button
                                    type="button"
                                    onClick={() => addVariant(true)}
                                    className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                                >
                                    <Plus className="h-4 w-4 mr-1"/>
                                    Thêm biến thể
                                </button>
                            </div>

                            <div className="space-y-4">
                                {updateProduct.variants && updateProduct.variants.map((variant, idx) => (
                                    <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-medium text-gray-700">Biến thể {idx + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(idx, true)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Mã biến thể</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={variant.code}
                                                    onChange={(e) => updateVariant(idx, 'code', e.target.value, true)}
                                                    placeholder="Mã tự động"
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Màu sắc</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={variant.color}
                                                    onChange={(e) => updateVariant(idx, 'color', e.target.value, true)}
                                                >
                                                    <option value="">Chọn màu</option>
                                                    {colorOptions.map(color => (
                                                        <option key={color.name} value={color.name}>{color.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={variant.size}
                                                    onChange={(e) => updateVariant(idx, 'size', e.target.value, true)}
                                                >
                                                    <option value="">Chọn size</option>
                                                    {sizeOptions.map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={variant.quantity}
                                                    onChange={(e) => updateVariant(idx, 'quantity', e.target.value, true)}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!updateProduct.variants || updateProduct.variants.length === 0) && (
                                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                        <p className="text-sm">Chưa có biến thể nào. Nhấn "Thêm biến thể" để bắt đầu.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateProduct}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Cập nhật sản phẩm
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ProductManagement;
